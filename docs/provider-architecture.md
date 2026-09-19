# Provider architecture

| Category | MVP | Next | Production | Notes |
| --- | --- | --- | --- | --- |
| Identity | MockIdentityProvider | KYC sandbox | Licensed identity vendor | Do not hardcode a vendor |
| Payments | MockPaymentProvider | PSP sandbox | Approved PSP | Methods via config |
| FX | MockFXProvider | Institutional FX sandbox | Production FX | Quote expiry + disclosure |
| Broker | MockBrokerProvider | Broker sandbox | Licensed broker | Order lifecycle already modelled |
| Custody | MockCustodyProvider | Custodian sandbox | Licensed custodian | Positions remain first-class |
| Market data | Seeded sandbox | Vendor sandbox | Live vendor | Assets marked sandbox |
| Notifications | Mock in-app | Email sandbox | Email/push/SMS | Channels on Notification |
| Documents | Metadata stub / **GCS on Cloud Run** | Object storage sandbox | Encrypted object store | Classification field |
| Tax | Withholding estimate stub | Vendor | Vendor | Not full international tax |
| Global broker | Interface only | Sandbox | Production | Future US/EU/ETFs |

Commercial terms, regulatory dependency and data requirements are captured as Partner + RegulatoryRequirement records, not as code constants.
