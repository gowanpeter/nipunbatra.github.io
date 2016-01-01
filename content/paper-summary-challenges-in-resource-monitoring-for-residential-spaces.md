Title: Paper Summary: Challenges in Resource Monitoring for Residential Spaces
Date: 2014-02-24 15:26
Author: nipunbatra
Category: Blog
Tags: buildings, energy, nilm
Slug: paper-summary-challenges-in-resource-monitoring-for-residential-spaces

As the adage goes, "If you can not measure it, you can not improve it",
resource monitoring is considered the first step towards improving it.
Residential spaces contain multiple resources such as electricity, water
and gas. In this post,  I summarize the following paper entitled
: [Challenges in Resource Monitoring for Residential Spaces][]. This
paper was presented at the first edition of Buildsys held in 2009.

The paper discuss about the various resources in homes- water,
electricity, gas. The relationship between energy and water is brought
forward. Water is used to generate electricity in hydroelectric power
plants. On the other hand, electricity is used for water treatment. The
paper brings forward insights from  a 3 month deployment where water and
energy data was synchronously collected.

A comparison between water and energy activities is made. Typically, the
number of water fixtures within a home is much less than the number of
electrical fixtures. Water usage is often very sporadic. In contrast,
electricity usage is more spread out and often of a compound nature.
Often, there is a static power consumption by some appliances. The water
analogy would be constantly dripping fixtures. These factors combined
with the similarity of signatures exhibited by many elelctrical
appliances, makes energy disaggregation considerably harder than its
water analogue.

The authors use a  [Matched filter][] to detect water fixture acitivity.
Owing to the characteristics described above, it is easy to match big
water consuming fixtures such as the sprinkler. The authors highlight
that the approach is limited to big water consuming fixtures and for
smaller fixtures, there exists a direct accuracy-cost tradeoff. On
similar lines, the authors discuss some of the limitations of NILM.

Since the deployment covered both water and energy, the interplay
amongst the two can offer richer information. The authors illustrate
this by showing the synchronous water and energy footprint of a laundry
machine.

The authors highlight the challenges in fine grained resource
monitoring, some of which are as follows:

1.  User adaptation amidst
    1.  maintenance
    2.  privacy concerns- how best to balance information and privacy
        while meeting design goals

2.  Design spanning cost, accuracy, reliability
3.  Effective data processing and visualization enabled communication
    with end users
4.  Trade offs amongst existing techniques

An interesting notion of efficiency incorporating ambient conditions is
discussed. For instance, simply the raw water consumption by a water
sprinkler is of less importance when compared to the environment context
(eg. why to water if it rains).

  [Challenges in Resource Monitoring for Residential Spaces]: http://wiesel.ece.utah.edu/media/documents/pdf/2010/01/23/BUILDSYS09-YK.pdf
  [Matched filter]: http://en.wikipedia.org/wiki/Matched_filter
