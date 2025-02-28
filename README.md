# Vi - Network Device Testing Automation

A platform for automating software testing on network devices (routers, switches, and IoT devices) built with Django REST API and Next.js.

## Tech Stack

- **Backend**: Django REST Framework, PostgreSQL
- **Frontend**: Next.js, React

## Features in Development

- Device Under Test (DUT) management
- Test automation for network devices
- Test result tracking and reporting

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 22
- PostgreSQL

### Quick Setup

1. Backend:

```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. Frontend:

```bash
cd vi-gui
npm install
npm run dev
```

# Requirements

1. Client Requirements [Linux]

- nmcli
- ifconfig
- iw
- telnet
- ssh
- tftpd-hpa or any tftp server
- vsftpd
- iperf

# Settings

1. DB creds

- Provide DB creds in /config/settings.conf
- Provide log path

For Ex:

```
[DATABASE]
DBNAME=vi
DBHOST=localhost
DBPORT=5432
DBUSER=vignesh
DBPASSWD=root
API_URL=http://localhost:5000/

[LOG]
LOGPATH=/opt/vi/logs
```

## Project Status

This project is currently under active development. More features and documentation will be added as development progresses.
