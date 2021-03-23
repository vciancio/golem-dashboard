# Golem Dashboard

Just a very barebones reactjs dashboard which will display the stats of your golem nodes... Cause ssh-ing into each of them is too hard. Works with [vciancio/golem-node-server](https://github.com/vciancio/golem-node-server).

## Screenshots
|Desktop|Mobile|
|---|---|
|![image](screenshots/Golem-Dashboard-Desktop.png?raw=true)|![image](screenshots/Golem-Dashboard-Mobile.png?raw=true)|

## Environment Variables
| Variables | Description | Example |
| ------------- | ----------- | ------- |
| REACT_APP_ADDRESSES | List of `host:port` addresses where your golem instances are located. | 192.168.1.2:5000 |

## Ports
| Port | Description
| ---- | ---- |
| 3000 | Node Port |

## Running Without Docker
> Note, if you don't have your environment variables set on your system, you can set them for a single command as shown below.
~~~
cd app
REACT_APP_ADDRESSES=192.168.1.2:5000 npm run
~~~

## Running w/ Docker Compose
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
