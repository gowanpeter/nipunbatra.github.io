Title: Paper Summary: The Case for Apportionment
Date: 2014-02-25 16:32
Author: nipunbatra
Category: Blog
Tags: buildings, energy
Slug: paper-summary-the-case-for-apportionment

Occupants are an integral part of energy conservation measure. 
Previous research has looked at mechanisms to actively engage occupant to reduce their energy footprint.
In this post I summarize the following paper from Buildsys 2010- [The case of apportionment][].


The paper motivates the need of energy apportionment from a social angle citing that in a group dinner when bills are 
shared, no one tries to subsidize the fellow diners.  
 Several apportionment strategies are discussed.
 All apportionment policies should have the following two properties:

1.  **Completeness**: The sum of energy apportioned to individuals must add up to total energy
2.  **Accountability**: Actions by users should have maximal impact on their allocation and minimum on others

The apportionment strategies may be summarized as follows:

1.  **Static apportionment**: In this strategy the total energy consumption is divided equally among all the users. 
 It violates accountability as every user is allocated same energy use.
2.  **Dynamic apportionment**: A prerequisite to this set of approaches is to find individual’s occupancy timings.
 For instance, if a user is not present, should she be charged for electricity consumption.
    1. **Occupants policy**: In this strategy the instantaneous power consumption is divided 
    among the present occupants.This violates completeness owing to base automatic loads. 
     An enhancement over this policy is to divide the base load equally among all users. 
      This however violates accountability as an occupant may shift her load to base load and get subsidies 
       for the same.
    2.  **Personal load policy**: In contrast to the occupants policy, this policy tries to estimate individual 
     user’s load and equally divide the remaining. The strategy allocates average power consumption to a user.

Both the approaches yield similar results. The authors also discuss about refining personal consumption in shared loads. 
 While for activities like printing, the apportionment is possible by accessing printer logs, a similar analysis of 
  the coffee machine is nontrivial. While location services might reveal more information, their lablike 
   environment requirements, make them unsuitable for daily operations.

  [The case of apportionment]: https://www.cl.cam.ac.uk/~acr31/pubs/hay-apportionment.pdf
