#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Nipun Batra'
SITENAME = u'Nipun Batra'
SITEURL = 'http://nipunbatra.github.io/'
#SITEURL='http://localhost:8000'


TIMEZONE = 'Asia/Kolkata'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
FEED_RSS = 'all.rss.xml'


DISPLAY_PAGES_ON_MENU = False


MENUITEMS = (
    ('Blog home','http://nipunbatra.github.io/'),
    ('Home page', 'https://www.iiitd.edu.in/~nipunb/'),
)


# Social widget
SOCIAL = (('twitter', 'http://twitter.com/nipun_batra'),
          ('github', 'http://github.com/nipunreddevil'),
          ('linkedin', 'http://www.linkedin.com/profile/view?id=43966733'),
          )

DEFAULT_PAGINATION = 10

# use URLs that match old wordpress site
ARTICLE_URL = '{date:%Y}/{date:%m}/{slug}/'
ARTICLE_SAVE_AS = '{date:%Y}/{date:%m}/{slug}/index.html'

# comments
DISQUS_SITENAME = "nipunbatra"

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
TAG_CLOUD_STEPS = 1
TAG_CLOUD_MAX_ITEMS = 5
#
# Additions
STATIC_PATHS = ['images', 'downloads', 'downloads/notebooks',
                'downloads/files', 'downloads/code', 'favicon.png']

CODE_DIR = 'downloads/code'
NOTEBOOK_DIR = 'downloads/notebooks'

PLUGIN_PATH = '../pelican-plugins/'
PLUGINS = ['summary', 'liquid_tags.img', 'liquid_tags.video',
           'render_math', 'liquid_tags.youtube',
           'liquid_tags.include_code', 'liquid_tags.notebook',
           'liquid_tags.literal', 'pelican_gist',
           'sitemap']

THEME = '../pelican-themes/pelican-octopress-theme'
THEME = '../pelican-themes/skeleton'

#PYGMENTS_STYLE = 'default'
PYGMENTS_STYLE='friendly'

# For pelican-ootstrap3
#BOOTSTRAP_THEME = 'simplex'
#BOOTSTRAP_THEME = 'spacelab'
# nice but, background doesn't work well with code as is
#BOOTSTRAP_THEME = 'superhero'
#BOOTSTRAP_THEME = 'cosmo'


DISPLAY_BREADCRUMBS = False
DISPLAY_RECENT_POSTS_ON_SIDEBAR = True

AVATAR = None
ABOUT_ME = None
# TWITTER_WIDGET_ID='353505377641447424'
TWITTER_WIDGET_ID = ''
#GITHUB_USER = 'nipunreddevil'
#GITHUB_REPO_COUNT = True
#GITHUB_SKIP_FORK = True
#GITHUB_SHOW_USER_LINK = True


#INDEX_SAVE_AS = 'index.html'
# the deault _nb_header is changing
# fonts etc. of rest of notmyidea and pelican-bootstrap3 themes
# looks ok in notmyidea, but no style at all in bootstrap3
import os
EXTRA_HEADER = open(
    '_nb_header.html').read().decode('utf-8')
# EXTRA_HEADER = '' #need to flush


SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}


TWITTER_USER = 'nipun_batra'
GOOGLE_PLUS_USER = 'nipunbatra'
GOOGLE_PLUS_ONE = True
GOOGLE_PLUS_HIDDEN = True
FACEBOOK_LIKE = True
TWITTER_TWEET_BUTTON = True
TWITTER_LATEST_TWEETS = True
TWITTER_FOLLOW_BUTTON = True
TWITTER_TWEET_COUNT = 3
TWITTER_SHOW_REPLIES = 'false'
TWITTER_SHOW_FOLLOWER_COUNT = 'true'


# Search
SEARCH_BOX = True
