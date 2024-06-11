import requests


def client_execute(sum):
    for i in range(1500):
        sum = sum+1


def fetch_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        data = response.json()  # Assuming the response is in JSON format
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        return None


def post_data(url, payload):
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        result = response.json()  # Assuming the response is in JSON format
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error posting data to {url}: {e}")
        return None


if __name__ == "__main__":
    get_url = "http://localhost:8000/get-parameters"
    post_url = "http://localhost:8000/receive-parameters"

    # Fetch data
    fetched_data = fetch_data(get_url)
    if fetched_data:
        print("Fetched Data:")
        print(fetched_data)

    client_execute(0)

    payload = { "client_parameter": {"weights":[1,2,3]}, "client_id": 1024 }
    print("sending payload", payload)

    posted_data = post_data(post_url, payload)
    if posted_data:
        print("Posted Data:")
        print(posted_data)
