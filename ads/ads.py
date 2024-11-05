import requests
import json

from flask import jsonify, Flask

app = Flask(__name__)

api_link = 'http://localhost:8080/forads'

def get_services() -> list:
    response = requests.get(api_link + '/services/get')
    return response.json()['services']

def get_progresses(service_number):
    response = requests.post(api_link + '/deployments/progresses_by_service', json={'service_number': service_number})
    return response.json()['progresses']

def get_stops_left(service_number):
    response = requests.post(api_link + '/deployments/stops_left_by_service', json={'service_number': service_number})
    return response.json()['stops_left']

def get_high_loads_by_service(service_number):
    response = requests.post(api_link + '/services/get_high_loads', json={'service_number': service_number})
    return response.json()['stops']

def get_buses_by_service(service_number):
    response = requests.post(api_link + '/buses/get_by_service', json={'service_number': service_number})
    return response.json()['buses']

def get_available_buses(service_number):
    buses = get_buses_by_service(service_number)
    return [R for R in buses if R['current_status']=='In Depot']

def get_available_drivers_uids():
    response = requests.get(api_link + '/drivers/get_available')
    drivers = response.json()['drivers']
    return [driver['uid'] for driver in drivers]

def number_of_deployments_needed(service_number):
    high_loads = get_high_loads_by_service(service_number)
    running_number = len([R for R in get_stops_left(service_number) if (R > 3)])
    if len(high_loads) == 0:
        if running_number == 0:
            return 1
        return 0
    checker = []
    for stop in high_loads:
        threshold = 0
        if stop['current_load'] == 2:
            threshold = 2
        elif stop['current_load'] == 3:
            threshold = 3

        for progress in get_progresses(service_number):
            if progress < stop:
                if threshold > 0:
                    threshold -= 1

        checker.append(threshold)
    return max(checker)


def deploy(driver_queue, bus_queue):
    response = requests.post(api_link + '/deployments/deploy',
                             json={
                                'driver_uid': driver_queue.pop(0),
                                'bus_license_plate': bus_queue.pop(0)
                            })
    return response.json()['message']

@app.route('/')
def main():
    drivers_queue = get_available_drivers_uids()
    services = get_services()
    bus_queues = {}
    for service in services:
        bus_queues[service] = [R['license_plate'] for R in get_available_buses(service)]
    i = 1

    while True:
        # detect changes
        print(f"Starting iteration {i}, initialising...")
        services = get_services()
        new_available_drivers = get_available_drivers_uids()
        for driver in new_available_drivers:
            if driver not in drivers_queue:
                drivers_queue.append(driver)
        for service in services:
            new_available_buses = get_available_buses(service)
            for bus in new_available_buses:
                if bus['license_plate'] not in bus_queues[service]:
                    bus_queues[service].append(bus['license_plate'])

        for service in services:
            need = number_of_deployments_needed(service)
            print(f"{service} needs {need} deployed.")
            for n in range(need):
                print(f"Deploying bus #{n+1} for {service}...")
                print(deploy(drivers_queue, bus_queues[service]))

        print(f"Iteration {i} done!")
        i += 1

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1234)