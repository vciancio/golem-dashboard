# Golem Dashboard

Just a very barebones reactjs dashboard which will display the stats of your golem nodes... Cause ssh-ing into each of them is too hard.

## Environment Variables
| Variables | Description | Example |
| ------------- | ----------- | ------- |
| REACT_APP_ADDRESSES | List of `host:port` addresses where your golem instances are located. | 192.168.1.2:5000 |

## Docker Compose
~~~
version: '3.5'
services:
  node:
    container_name: golem_dashboard
    build: .
    restart: always
    environment:
    - REACT_APP_ADDRESSES=192.168.1.2:5000,192.168.1.2:5001
    volumes:
      - /etc/localtime:/etc/localtime:ro
    ports: 
      - 3000:3000
~~~
