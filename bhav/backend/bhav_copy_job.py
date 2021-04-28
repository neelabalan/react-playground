import io
import os
import requests
import datetime
import pytz 
import datetime 
import csv
import logging

from redis import Redis
from zipfile import ZipFile
from apscheduler.schedulers.blocking import BlockingScheduler


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# creating file handler
logpath = os.path.join('/tmp/bhav_copy.log')
handler = logging.FileHandler(logpath)
handler.setLevel(logging.INFO)

# creating logging format
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s", "%d-%m-%Y--%H:%M:%S")
handler.setFormatter(formatter)
logger.addHandler(handler)


sched = BlockingScheduler(timezone=pytz.timezone('Asia/Calcutta'))
redis = Redis(host="localhost", port=7001)

def get_basefile_name(date=datetime.datetime.now()):
    ''' get basefile name '''
    yesterday = date - datetime.timedelta(days=1)
    return 'EQ' + yesterday.strftime("%d%m%y")

def get_zipfile_name(date=datetime.datetime.now()):
    ''' get the zipfile format for downloading the file '''
    return get_basefile_name() + "_CSV.zip"

def construct_url():
    ''' construct url for download '''
    base_url = 'http://www.bseindia.com/download/BhavCopy/Equity/'
    return base_url + get_zipfile_name() 

def get_extract_path():
    ''' get path to save and access zipfile locally '''
    return '/tmp/BhavCopy/zip/{}'.format(get_zipfile_name()[:-4])

def download_and_extract(url):
    ''' download the zip file and save it '''
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=2)
        response.raise_for_status()
        with ZipFile(io.BytesIO(response.content)) as zipfile: 
            zipfile.extractall(get_extract_path())
    except requests.exceptions.HTTPError as err:
        logger.warning('HTTP Error - {}'.format(err))
    except requests.exceptions.Timeout as timeouterr:
        logger.warning('Timeout Error - '.format(timeouterr))


def load_data(
    file="sample.csv",
    interested_columns=("SC_CODE", "SC_NAME", "OPEN", "HIGH", "LOW", "CLOSE"),
):
    with open(file) as csvfile:
        for row in csv.DictReader(csvfile):
            redis.hset(
                row["SC_NAME"].strip(),
                mapping={field: row.get(field).strip() for field in interested_columns},
            )

def job():
    url = construct_url()
    logger.info('URL for download and extraction {}'.format(url))
    download_and_extract(url)
    logger.info('Download and extraction done successfully')
    load_data(
        file=os.path.join(get_extract_path(), get_basefile_name() + '.CSV')
    )
    logger.info('Redis updated with latest data')

if __name__ == "__main__":
    sched.add_job(job, 'cron', day_of_week='mon-fri', hour=18, minute=49)
    sched.start()
