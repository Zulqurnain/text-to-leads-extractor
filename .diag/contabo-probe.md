# Contabo API Probe — 2026-05-16T14:37:19Z

## Step 1: Get OAuth token
```
token_len=1491
```

## Step 2: List instances
```
{
    "data": [
        {
            "tenantId": "INT",
            "customerId": "YOUR_CUSTOMER_ID",
            "additionalIps": [],
            "name": "vmi3301936",
            "displayName": "OpenClaw - vmi3301936",
            "instanceId": YOUR_INSTANCE_ID,
            "dataCenter": "European Union 2",
            "region": "EU",
            "regionName": "European Union",
            "productId": "V95",
            "imageId": "d64d5c6c-9dda-4e38-8174-0ee282474d8a",
            "ipConfig": {
                "v4": {
                    "ip": "YOUR_VPS_IP",
                    "gateway": "YOUR_VPS_GATEWAY",
                    "netmaskCidr": 24
                },
                "v6": {
                    "ip": "2a02:c207:2330:1936:0000:0000:0000:0001",
                    "gateway": "fe80::1",
                    "netmaskCidr": 64
                }
            },
            "macAddress": "00:50:56:63:fc:45",
            "ramMb": 12288,
            "cpuCores": 6,
            "osType": "Linux",
            "diskMb": 204800,
            "createdDate": "2026-05-15T10:07:51.000Z",
            "cancelDate": null,
            "status": "running",
            "vHostId": 11122,
            "vHostNumber": 14897,
            "vHostName": "m14897",
            "addOns": [
                {
                    "id": 1501,
                    "quantity": 1
                },
                {
                    "id": 2134,
                    "quantity": 1
                }
            ],
            "productType": "ssd",
            "productName": "Cloud VPS 20 SSD (no setup)",
            "defaultUser": "root",
            "applicationId": "3af31f69-9a60-4762-a7d9-763d68fde85f"
        }
    ],
    "_links": {
        "first": "/v1/compute/instances?size=20",
        "previous": "",
        "next": "",
        "last": "/v1/compute/instances?page=1&size=20",
        "self": "/v1/compute/instances"
    },
    "_pagination": {
        "size": 20,
        "totalElements": 1,
        "totalPages": 1,
        "page": 1
    }
}
```

## Step 3: Find instance for YOUR_VPS_IP
```
