Title: Paper summary: Building Application Stack (BAS)
Date: 2014-02-19 17:47
Author: nipunbatra
Category: Blog
Tags: buildings, energy
Slug: paper-summary-building-application-stack-bas

Buildings house a number of sensors  and actuator ranging across various
applications including, but not limited to, utility metering (water,
gas, electricity), HVAC control, lighting, security. Each of these
sub-systems usually expose their data over different protocols making it
difficult to design generic applications on top. This gets particularly
hard when moving across different buildings. Maybe, time to do software
engineering for buildings?

In this post I summarize the paper [Building Application Stack (BAS)][]
which won the best paper award at Buildsys 2012. The paper motivates the
need of an API for building applications owing to lack of "portability"
in building applications. While many Building automation protocols such
as BACnet, LONtalk partially address this via their schemes, the lack of
portability remains a concern. Another target of the paper is to be able
to answer and address queries such as the following: What is the
**light** level of on all floors **above** the **10th floor?**For
answering such queries sensors and its abstractions are necessary, but
not complete. The various relationships among different sensors,
actuator, physical spaces, etc. should be taken into account.

The approach followed in the paper is based on well known software
engineering principles. The layered architecture is summarized at
follows:

1.  Close to the hardware is the interconnection interface which exposes
    the hardware points via their protocols such as BACnet. These points
    have non-trivial names such as “SDH.AH1A.SF VFD:INPUT" which is a
    speed input to variable frequency drive.
2.  To introduce portability, the next layer consists of drivers which
    expose necessary interfaces. For instance, a fan driver would expose
    get\_speed() and set\_speed(x). Drivers can be constructed in
    hierarchical fashion. HVAC chiller driver may contain drivers for
    fan etc.
3.  Functional and spatial relationships are needed to answer questions
    like which circuit powers lighting, which AHU serves a particular
    room. For modeling functional relationships, BAS uses directed
    graphs. For modeling spatial relationships BAS incorporates spatial
    tags.
4.  The top most layer is the query layer and allows accessing driver
    objects based on different attributes. Those who know about jQuery
    might see some parallels with the driver access. BAS query layer is
    language agnostic.

The authors use BAS and compare its tradeoff with conventional
customized building applications across two buildings and two
application scenarios. The intended purposes are evident by the minimal
changes required while porting across buildings which use different
automation protocols. In conclusion, the paper brings software
engineering to the buildings domain and the rich query interface allows
diverse set of applications to be built easily on top of BAS.

  [Building Application Stack (BAS)]: http://www.cs.berkeley.edu/~krioukov/BAS.pdf
