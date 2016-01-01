Title: Paper summary:: SmartCap: Flattening Peak Electricity Demand in Smart Homes
Date: 2014-02-18 17:27
Author: nipunbatra
Category: Blog
Tags: buildings, energy, nilm
Slug: paper-summary-smartcap-flattening-peak-electricity-demand-in-smart-homes

Many studies have proposed methods of reducing electricity consumption.
However, for the utility companies, merely reducing overall consumption
may not amount to reduction in production. This is due to the fact that
the peak load drives the grid's production. Thus, reducing the peak load
on the grid by load shifting can help lower the peak demand on the grid.
To help realize such a goal, utilities often charge commercial customers
based on peak v/s non-peak demand. In this post, I summarize the
following paper titled: [SmartCap: Flattening Peak Electricity Demand in
Smart Homes][], from[LASS group][], UMASS.  
The paper studies the different types of loads(appliances) present in a
typical home. They are divided into two broad categories:

1.  Interactive: such as television, microwave, which are actively
    controlled by a user
2.  Background: such as fridge, air conditioner, which have their own
    control systems and once temperature settings are maintained they
    operate without human intervention.

The authors emphasize the fact that modifying the schedule of
interactive loads is not considered as it may interfere with daily
operations. Thus, they consider scheduling only the background loads.
Background loads constitute a very small proportion of overall number of
loads (10% or so). However, they may contribute very significantly to
the overall energy consumption, eg. air conditioners and refrigerators
are usually the loads contributing the most during the peak summer
season. Both these kinds of loads show a lot of variability in their
operations- background loads due to environmental conditions and the
interactive loads due to activity.

The authors draw inspiration from the Earliest deadline scheduling
algorithm, which is a well know algorithm used for scheduling real time
embedded systems.  The key component of the algorithm is "slack" which
the authors define as the extent to which a scheduler is able to
advance, defer, raise, or lower a load’s power consumption without
affecting its operational goal. In the case of electrical load
scheduling the operational goal is defined in terms of its intended
state after running, eg. after one complete cycle the internal
refrigerator temperature should reach 10 degrees.  The slack of a load
is defined as the time which it can remain off without missing its
objective. Similar to scheduling in real time embedded systems,
information about remaining slack is known. However, the important
difference is that the algorithm presented by the authors is modified to
suit the case when slacks may vary with time, unlike in many scheduling
algorithms where the slacks are pre submitted. This is an important
feature of the paper and a simple linear slack model is assumed by the
authors for the same.

The authors present results both from simulation and from data collected
in real world settings. Under both these data sets, they show that their
approach helps to lower the deviation from average consumption (making
the load curve flatter). The approach provides higher gains when used in
peak consumption period such as morning breakfast hours when many
interactive loads are also on.

 

  [SmartCap: Flattening Peak Electricity Demand in Smart Homes]: http://citeseerx.ist.psu.edu/viewdoc/download?rep=rep1&type=pdf&doi=10.1.1.221.2314
  [LASS group]: http://lass.cs.umass.edu/
