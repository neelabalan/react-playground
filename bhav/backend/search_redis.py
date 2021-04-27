from redis import Redis
import json
redis = Redis(host="localhost", port=7001, decode_responses=True)

search_term = "and"
def bhav_bse():
    bhav_keys = redis.keys('*' + search_term.upper() + '*')
    bhav_data = []
    for key in bhav_keys:
        data = redis.hgetall(key)
        bhav_data.append(data)
        # print(bhav_data)
    print(json.dumps(bhav_data, indent=4))

bhav_bse()