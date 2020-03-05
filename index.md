---
layout: index
title: "Brentian.io"
subtitle: Brentian C. Zhang
---

Periodical review of my work.


{% capture numposts %}{{ site.posts | size }}{% endcapture %}
{% if numposts != '0' %}
## Posts by Year

{% for post in site.posts %}{% assign currentyear = post.date | date: "%Y" %}{% if currentyear != prevyear %}
### {{ currentyear }}
{% assign prevyear = currentyear %}{% endif %} - [{{ post.title }}]({{ site.baseurl }}{{ post.url }}) - {{ post.date | date: '%B %-d' }}
{% endfor %}
{% endif %}