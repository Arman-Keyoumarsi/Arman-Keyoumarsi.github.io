---
layout: post
title:  "SQL Server AlwaysOn Availability Group Architecture"
date:   2018-08-12
excerpt: "Design and component of SQL Server AlwaysOn Availability Group"
tag:
- SQL
comments: true
---

Always ON availability group is a solution from Microsoft that enables administrators to combine high availability for SQL databases as well as providing disaster recovery option by stretching the database replicas to a secondary site.

There are numerous benefits of using AlwaysON availability groups to AlwaysON failover clustering instance. They can be summarized as follows:
* It extends support to provide nine availability replicas. Since availability replica is used to maintain a local copy of all the databases, they prove to be very crucial in ensuring database availability at the time of data disasters.
* It supports variant failovers like planned manual failover, automatic failover and forced failover.
* The failover time is usually much faster than (< 30) failover of the entire server in AlwaysON failover clustering.
* Remove the need for RDM disk in virtual environment
* Possibility of offloading backup operation and distributing read operation to secondary replicas.

## Availability Modes:

* Asynchronous-commit mode is a disaster-recovery solution that works well when the availability replicas are distributed over considerable distances. If every secondary replica is running under asynchronous-commit mode, the primary replica does not wait for any of the secondary replicas to harden the log. Rather, immediately after writing the log record to the local log file, the primary replica sends the transaction confirmation to the client. The primary replica runs with minimum transaction latency in relation to a secondary replica that is configured for asynchronous-commit mode. If the current primary is configured for asynchronous commit availability mode, it will commit transactions asynchronously for all secondary replicas regardless of their individual availability mode settings.
* Synchronous-commit mode emphasizes high availability over performance, at the cost of increased transaction latency. Under synchronous-commit mode, transactions wait to send the transaction confirmation to the client until the secondary replica has hardened the log to disk. When data synchronization begins on a secondary database, the secondary replica begins applying incoming log records from the corresponding primary database. As soon as every log record has been hardened, the secondary database enters the SYNCHRONIZED state. Thereafter, every new transaction is hardened by the secondary replica before the log record is written to the local log file. When all the secondary databases of a given secondary replica are synchronized, synchronous-commit mode supports manual failover and, optionally, automatic failover.


## Architecture:

For AlwaysON availability group to work, all the SQL nodes should be part of the Windows Server Failover Clustering (WSFC) and be running on windows server 2012 or later version. To achieve the maximum performance, it is recommended to use SSD storage for DB and Logs disk and use dedicated network both for virtual listener and replication. Furthermore, the disaster site can be used to host non-essentials databases as it will only host the asynchronized DBs and won’t have the same performance requirement as the primary and secondary replicas.

The generalized architecture of AlwaysON availability group is shown in the figure 1 below:

![Smithsonian Image]({{ site.url }}/assets/BlogsIMGs/2018-08-12-SQL-AlwaysOn-Availability-Group-Architecture/Figure1-AlwaysON availability group Architecture.png)
{: .image-Center}
<center>Figure1 : AlwaysON availability group Architecture</center>


The high availability for the server instances can be provided through VMWare HA and DRS as they are fully compatible with AlwaysON availability group.

Regarding the SQL port selection, there are variety of options available. All the ports both for availability group and SQL instances port can be changed therefore giving greater flexibility to harden the solution.

I hope this post has been useful to you. For any question or suggestion please leave a comment below and I’ll be happy to get back to you.

**Author: Arman Keyoumarsi**
