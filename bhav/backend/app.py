from flask import Flask, jsonify, request
from redis import Redis
import json

app = Flask(__name__)
redis = Redis(host="localhost", port=7001, decode_responses=True)

def bhav_bse(search_term):
    bhav_keys = redis.keys('*' + search_term.upper() + '*')
    bhav_data = []
    for key in bhav_keys:
        data = redis.hgetall(key)
        bhav_data.append(data)
        # print(bhav_data)
    # print(json.dumps(bhav_data, indent=4))
    return bhav_data

@app.route('/v1', methods=['GET'])
def test():
    term = request.GET.get('search')
    return jsonify(bhav_bse(term)) 

if __name__ == '__main__':
    app.run()
