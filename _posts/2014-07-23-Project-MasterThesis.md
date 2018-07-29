---
layout: post
title:  "Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks"
date:   2014-07-23
excerpt: "Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks, using opensource tools"
project: true
tag:
- Network 
- OpenFlow
- SDN
comments: true
---

# Distributed Traffic Matrix Measurement

The current network architecture is constrained. The development of new protocols to cope with 
new demands in computer networks such as real time streaming and voice over IP is not an 
easy task. Other than developing new protocols, computer networks should be able to rapidly 
deploy changes across networking equipment. Software-Defined Networking promises to 
simplify network management tasks and enable rapid developments of new protocols. SDN 
separates the control plane from the data planes in the switches, bringing a level of abstraction 
needed to manage sets of switches from a central location. OpenFlow has become a de facto 
standard for communication between control plane and data planes. 

One key information for network planning and management is the traffic matrix (TM). TM is 
defined as the volume of traffic transported by the network during a period of time from any 
ingress node to any egress node in a network. OpenFlow-based networks in particular must be 
able to continuously monitor performance metrics, in order to quickly adapt forwarding rules to 
utilize network resources in the best possible manner. However, current solutions for monitoring 
either require special monitoring equipment or impose significant measurement overhead. 

In this thesis, we propose a distributed way of measuring traffic, where every ingress node in 
the network is responsible for measuring a portion of the traffic matrix. We only used a set of 
features already available in the latest version of OpenFlow without any need of modification in 
the platform. Therefore our framework can be deployed on any OpenFlow (version 1.3 or 
higher) enabled network. The effectiveness of our solution is demonstrated through series of 
emulation in Mininet and in a test-bed with low-end OpenFlow switches.

## Introduction

One of the conundrums in today’s networking is its complexity [1]. Even though computation
and storage have been virtualized, leading to a more flexible and manageable infrastructure, the
concept of virtual networks is still fairly new and hard to implement, because of the complexity in
today’s network structure. Networks used to be simple at core (Ethernet/IP protocols are
straightforward and easy to manage [2]) but with the introduction of new services like voice over
IP and real time streaming, the need for new control requirements, like Access Control Lists
(ACLs), Virtual Local Area Networks (VLANs), Traffic Engineering (TE), and Quality of Service
(QoS) led to the complexity of current networks. 

Furthermore, to keep up with new demands and services, new protocols and control
mechanisms need to be developed. The creation and introduction of new protocols is not an
easy task, since they have to co-exist with legacy mechanisms. In addition, the process of
testing and approval by the equipment vendors may take years and considerable investment.

So why are computer networks so complex, as of today? The lack of abstraction in the
networking industry has kept it behind, compared to other fields. For example, looking at
computer programming, networking can be compared to the phase when Assembly language
was used, when there were no abstractions and the programmer had to deal with low-level
details, which made the process of writing applications fairly complex and time consuming. As
Donald Norman1 said,

> “The ability to master complexity is not same as the ability to extract simplicity”.

Software defined networking [3] was introduced in 2008, as a concept evolving form the work
done at UC Berkeley and Stanford University, by bringing abstraction in computer networking
and solving some of the issues mentioned earlier. The concept of SDN focuses on the
separation of Control and Data planes, bringing long overdue abstraction needed to create,
develop and deploy network applications which are hardware independent and managed from a
central point. The vantage point of the centralized SDN controller allows to globally optimize the
network behavior with any goal the developer can imagine, such as load balancing, maximizing
reliability, minimizing delay or energy consumption, to name a few possibilities. In order for such
vision to become realizable, standard interfaces between the controller and the devices must be
developed. OpenFlow [4] is one of the protocols that follow the SDN architecture, providing
easy-to-use APIs to identify, configure and manage networks of switches from the controller. 

To design, develop, manage and test a computer network, good network engineering is needed.
Specifically, one key piece of information needed during the network planning and operation is
the Traffic Matrix (TM), or Demand Matrix [5]. The TM provides information about the volume of 
traffic, offered by the end users, that is sent from any ingress node to every egress node of the
network during a certain period of time. Knowing how the traffic flows in the network can help
designing a better and more efficient network, and is essential to validate the performance of
new protocols. 

Today, the traffic matrix can be obtained through various methods, either by directly measuring
and collecting the packet headers and timestamps, or by collecting aggregates of flows that
ingress and egress the network. There are solutions like NetFlow [6] or sFlow [7] that are able to
capture the flow statistics, but deploying these solutions needs extra investments, can be fairly
complex (for example, the correlation of routing and traffic information is not trivial), in some
cases vendor dependent, and can cause unnecessary performance degradation in the network.
Monitoring flows in thousands per second in the edge nodes can cause extra CPU load and,
besides, collecting all the information needs additional burden on the network and extra
equipment to do so [8]. 

Openflow has introduced new possibilities for obtaining the TM. For the first time a central
location has a complete view of the network and can rapidly configure and deploy changes
across the network. OpenFlow has gone through various versions and improvements, and new
features were added with each version, being some of them related to traffic measurement,
such as per-flow counters and meters. Nonetheless OpenFlow is not perfect, and there are still
limitations and obstacles in deploying it, such as optimization of memory usage in the switches. 

The goal of this thesis is to study how to use the new features introduced in the latest versions
of Openflow to obtain TMs accurately and with the least possible overhead, both in terms of
operation and deployment. We have developed a framework that evenly distributes tasks for
measuring traffic across the edge switches in the network. A central controller will configure all
the edge switches to measure their incoming traffic to every egress point in the network,
effectively calculating a row of the TM. By doing so we have been able to reduce the processing
power needed in the controller, and reduce the load on the switches. Our framework is designed
using the current set of features available in OpenFlow 1.3 and above, and therefore making it
possible to be deployed in any current OpenFlow enabled network without the need to modify
neither the switches nor the controller. Furthermore, we have evaluated the effect of deploying
the framework in a test-bed with real low-end networking equipment (OpenWRT [9] routers2 with
OpenFlow capabilities), demonstrating upmost accuracy and low cost of operation. The only
concern that may arise is the extra memory needed to allocate rules for measuring the traffic in
the switch, which in the case of networks with tons of distinct flows may cause in degradation of
the switch performance; but to the best of our knowledge, this is a tradeoff that any TM
measurement technique has to face. 

If you want to learn more. You can download the complete thesis below:

[Download Thesis]({{ site.url }}/assets/download/Distributed Traffic Matrix Measurement in OpenFlow Enabled Networks.pdf){: .btn}