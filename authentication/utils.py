import json
from django_redis import get_redis_connection

def notify_frontend(data):
    # Assuming 'data' is a dictionary containing the update information
    channel_name = "updates"  # Choose an appropriate channel name
    message = json.dumps(data)

    # Publish the message to the Redis channel
    redis_connection = get_redis_connection("default")
    redis_connection.publish(channel_name, message)
