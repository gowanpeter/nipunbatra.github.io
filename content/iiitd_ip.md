Title: NILMTK Independent Project for IIITD students
Date: 2014-08-04 10:40
Author: nipunbatra
Category: Blog
Tags: nilmtk
Slug: nilmtk-ip-iiitd


Hi everyone! I am sure all of you would have heard about [Google summer of code (GSoc)](http://en.wikipedia.org/wiki/Google_Summer_of_Code). Sounds like a good idea, doesn't it? How about doing a Gsoc kind of project while getting credits for it? Of course, money ain't involved here :(

In this post, I'll be discussing about positions for Independent project for IIITD students. I have been working on non intrusive load monitoring (NILM) for close to 2 years now. The following image and paragraph is a 2 minute introduction to NILM.

![nilmtk image](http://nilmtk.github.io/img/disaggregation.png)

Just imagine that you could somehow collect data from your electricity meter in real time. Using this data, you use machine learning to determine the power consumption of different appliances. Ok, the easy stuff ends there!

As you would imagine with anything involving machine learning, we too deal with data sets and quite variable ones they are! Interestingly, the research in this field was impeded due to a lot of factors- papers would present their evaluations on different data sets (which doesn't particularly be a very sound comparison), papers would use different accuracy metrics to present their results. More such issues inspired me to work closely with two UK based researchers ([Jack](http://www.jack-kelly.com/) and [Oliver](http://www.oliverparson.co.uk/)) to build a toolkit, called nilmtk,  specifically to address these pain points. Think of it is as [Weka](http://www.cs.waikato.ac.nz/ml/weka/) for NILM. Actually, [nilmtk](http://nilmtk.github.io/) is much more than that!

I presented nilmtk at [eEnergy 2014](http://arxiv.org/pdf/1404.3878v1.pdf), held at Cambridge university in June. I think the slides should give a high level overview of what nilmtk is all about.

<script async class="speakerdeck-embed" data-id="ffca6210fe1301319b0512528e555330" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>


You may also visit the project page up [here](http://nilmtk.github.io/).

Since that a lot of things have changed. Recently, [nilmtk v0.2](http://nilmtk.github.io/nilmtk/master/intro_nilmtk_v0_2.html) was released. It is designed keeping in mind OOPS principles and designed to handle large data sets. We are not there yet in porting everything which worked in v0.1 to v0.2. 

Against this background, let me now get to the business end of this post.


### What would this IP involve
#### Initial phase
1. Getting an understanding of nilmtk
2. Closing out some of the issues on the nilmtk issue tracker
3. Improving unit test coverage

#### Later phases
In a broad sense, these phases would involve reducing the entry barrier for researchers. This would include adding more NILM algorithms, converting existing data sets for nilmtk, etc. I'll update this bit based on how the initial phase pans out.

#### Long term plans (and wishlist)
To ensure that nilmtk becomes a community driven project (maybe one day like scikit-learn), it helps in advacncing the state of the art....


### Applying for this IP
I'll try and keep the application procedure as close to Gsoc as possible. Since nilmtk is an open source project on github, why not leverage the issue queue for the selection process. Given that the deadline for choosing courses closes on Monday, 11th August, the application should be completed before that. I'll enlist the application requirements as follows:

1. Install nilmtk on your local machine. I would recommend doing the same on Unix/Linux based systems. Also, I'll recommend using [Anaconda Python distribution](https://store.continuum.io/cshop/anaconda/) to install all the Python dependencies in one go. Feel free to create an issue on github if you face installation issues (you are already contributing to the project this way!).
2. Browse through the [issue queue](https://github.com/nilmtk/nilmtk/issues) on github and read in detail about these different issues. In case you need more clarity, ping on the issue queue. Ask questions! Find an issue which you would like to address for this application. Looking at closed issues and the discussions around them may also prove to be very beneficial. We would often associate a code commit to close an issue. 
3. Make a pull request to solve the issue. Your pull request would be evaluated on existing unit tests and send a report if we are ready to merge. Typically, each pull request should be accompanied with a unit test for the additional functionality.
4. Alternatively, you could also have a look at some of the projects enlisted [here](https://github.com/nilmtk/nilmtk/wiki/Development-projects) and get started.
5. Or, you come up with your own proposal for what you think nilmtk needs and provide good reasons for why you think these features may be needed.

Personally, I'll prefer people who can commit to working on the project beyond this IP. There is a significant investment from my side in each IP and the returns would be far better if the student would continue on the project.


Don't feel shy in taking help from your peers. Also, don't feel intimidated by the task. This sure is non-trivial. It has taken me and other two core developers (all of whom are PhD. and above) a lot of effort to get this project to this stage. So, a lot of things would seem over the head stuff. There would be stuff which my co-developers and I have in our heads, but, is not on github. For these kinds of things, feel free to create new issues on github. 


### Assessment
On the lines of Gsoc, you'll have to maintain a tech blog, where you update your progress on a weekly basis. I use [pelican](http://nipunbatra.github.io/2014/04/moved-to-pelican/) for my blog as it allows me to use embed IPython notebooks with fair ease. Also, since everything is up on github, the evaluation should be pretty transparent. Like Gsoc expects, the student should be primarily self driven.

### Why nilmtk
You'll be contributing to a live project. The project is open source, uses state-of-the-art technologies, has 40+ unit tests, continuous integration, coverage testing. So, in some sense, the project is close to industrial grade and we intend to keep it this way. Although this IP would mainly be engineering focused, nothing stops you from taking this as BTP, next year summer internship or do some research work on these lines. 

In case you have some general queries, feel free to leave your comments below this post. For specific technical queries use github. For remaining queries, write me an email with the subject containing ["iiitd nilmtk query"].

This is the first time I am opening up IP positions in this fashion. So, if things seem a bit haphazard, please feel free to report back. In general, I would be happy to answer your queries about nilmtk and related research. 

On a closing note, let me reiterate that don't feel shy to ask for help! Moreover, I am also trying to assess the entry barrier to nilmtk and such feedback from you all should be highly valuable. In an ideal setting, I would have allowed the application time to be about a month. However, I think that students do need to submit their final courses in the second week. In case, this sounds interesting and you are unable to apply, feel free to mail me.