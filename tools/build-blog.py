"""Regenerate static editorial pages and homepage cards: python3 tools/build-blog.py."""
from pathlib import Path
from html import escape
import json
import re
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
stories = json.loads((ROOT / 'blog-stories.json').read_text())
index = (ROOT / 'index.html').read_text()
e = escape

def url(story):
    return f"story-{story['slug']}.html"

def date_label(story):
    if story.get('date'):
        published = date.fromisoformat(story['date'])
        return f'<time datetime="{e(story["date"])}">{published.strftime("%d %B %Y")}</time>'
    return '<span>Publication date to be added</span>'

def label(story):
    return '<span class="story-sample">Sample story · placeholder</span>' if story.get('sample', True) else ''

def card(story):
    return f'''<article class="story-card" data-story-category="{e(story['category'])}">
      <a class="story-image" href="{url(story)}" tabindex="-1" aria-hidden="true"><img src="{e(story['image'])}" alt="" loading="lazy" width="800" height="600" /></a>
      <div class="story-card-copy"><p class="eyebrow">{e(story['category'])}</p>{label(story)}
      <h3><a href="{url(story)}">{e(story['title'])}</a></h3><p>{e(story['excerpt'])}</p>
      <div class="story-card-bottom"><p class="story-date">{date_label(story)}</p><a class="story-text-link" href="{url(story)}" aria-label="Read more: {e(story['title'])}">Read More <span aria-hidden="true">↗</span></a></div></div>
    </article>'''

def newsletter():
    return '''<section class="newsletter-section section" aria-labelledby="newsletter-title"><div class="container newsletter-layout">
      <div><p class="eyebrow">LET’S KEEP IN TOUCH</p><h2 id="newsletter-title">Stay in the Loop</h2><p>Trending stories, useful finds, digital insights and new releases — straight to your inbox.</p></div>
      <!-- Connect a provider endpoint, enable these fields, and remove the preview handler only after integration. -->
      <form class="newsletter-form" data-newsletter-form data-provider="unconnected" aria-describedby="newsletter-note">
        <label for="newsletter-email">Email address</label><div class="newsletter-fields"><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Your email address" disabled /><button class="button" type="submit" disabled>Subscribe</button></div>
        <p id="newsletter-note" class="newsletter-note">Coming soon. Subscriptions are not open yet; no email addresses are collected.</p>
      </form></div></section>'''

header = re.search(r'<header class="site-header editorial-header">.*?</header>', index, re.S).group()
header = re.sub(r'href="#([^"]+)"', r'href="index.html#\1"', header)
header = header.replace(' class="active"', '').replace('<a href="blog.html">Blog</a>', '<a href="blog.html" class="active" aria-current="page">Blog</a>')
footer = re.search(r'<footer class="site-footer editorial-footer">.*?</footer>', index, re.S).group()
footer = re.sub(r'href="#([^"]+)"', r'href="index.html#\1"', footer)

def page(title, description, content):
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="{e(description)}" /><title>{e(title)} | Folashade Adekunle</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&amp;family=Inter:wght@400;500;600&amp;display=swap" />
<link rel="stylesheet" href="style.css" /><link rel="stylesheet" href="editorial.css" /></head>
<body class="editorial-portfolio editorial-page"><a class="editorial-skip" href="#editorial-main">Skip to content</a>{header}
<main id="editorial-main">{content}</main>{footer}<script src="script.js"></script><script src="editorial.js"></script></body></html>\n'''

featured = stories[0]
categories = ['Trending', 'Culture & Society', 'Digital & AI', 'Business', 'Property', 'Lifestyle', 'Career']
filters = ''.join(f'<button type="button" data-story-filter="{e(c)}" aria-pressed="false">{e(c)}</button>' for c in categories)
blog = f'''<section class="editorial-intro container"><p class="eyebrow">THE JOURNAL · BY FOLASHADE ADEKUNLE</p><h1>A curious mind.<br /><em>A world to explore.</em></h1><p>Ideas, perspectives and discoveries at the intersection of life, digital creativity and business.</p><p class="editorial-preview-note">An editorial space in the making. All stories below are clearly labelled samples, ready to be replaced with original articles.</p></section>
<section class="container featured-section" aria-labelledby="featured-title"><div class="editorial-section-line"><h2 id="featured-title">Featured Story</h2><span>THE OPENING EDIT</span></div>
<article class="featured-story"><a class="featured-image" href="{url(featured)}" aria-label="Read featured story"><img src="{e(featured['image'])}" alt="{e(featured['alt'])}" width="900" height="1000" fetchpriority="high" /></a>
<div class="featured-copy"><p class="eyebrow">{e(featured['category'])}</p>{label(featured)}<h3>{e(featured['title'])}</h3><p>{e(featured['excerpt'])}</p><p class="story-date">{date_label(featured)}</p><a class="button" href="{url(featured)}">Read Story <span aria-hidden="true">↗</span></a></div></article></section>
<section class="section container" aria-labelledby="latest-title"><div class="editorial-section-line"><h2 id="latest-title">Latest Stories</h2><span>NOTES &amp; PERSPECTIVES</span></div>
<div class="story-filters" role="group" aria-label="Filter stories by category" hidden><button type="button" data-story-filter="all" aria-pressed="true">All Stories</button>{filters}</div><p class="story-filter-status" role="status" aria-live="polite">{len(stories)} sample stories</p><div class="story-grid" data-story-grid>{''.join(card(s) for s in stories)}</div></section>{newsletter()}'''
(ROOT / 'blog.html').write_text(page('The Journal', 'The personal editorial journal of Folashade Adekunle. Sample stories on life, culture, digital creativity and business.', blog))
for story in stories:
    body = ''.join(f'<section><h2>{e(section["heading"])}</h2>'+''.join(f'<p>{e(p)}</p>' for p in section['paragraphs'])+'</section>' for section in story['body'])
    related = [s for s in stories if s['slug'] != story['slug']][:3]
    content = f'''<article class="article-layout container"><header class="article-heading"><a class="story-text-link" href="blog.html">← Back to the Journal</a><p class="eyebrow">{e(story['category'])}</p>{label(story)}<h1>{e(story['title'])}</h1><p class="article-subtitle">{e(story['excerpt'])}</p><p class="article-byline">By {e(story['author'])} <span aria-hidden="true">·</span> {date_label(story)}</p></header>
<figure class="article-hero"><img src="{e(story['image'])}" alt="{e(story['alt'])}" width="1200" height="800" /><figcaption>Portfolio photograph used as a sample editorial image.</figcaption></figure>
<div class="article-body">{body}<aside class="article-share" aria-labelledby="share-title"><h2 id="share-title">Share this story</h2><div><button type="button" class="button button-secondary" data-copy-story hidden>Copy link</button><a class="story-text-link" href="mailto:?subject={e(story['title'])}" data-email-story>Share by email ↗</a></div><p class="share-status" role="status" aria-live="polite"></p></aside></div></article>
<section class="section container" aria-labelledby="related-title"><div class="editorial-section-line"><h2 id="related-title">Related Stories</h2><a class="story-text-link" href="blog.html">View All Stories ↗</a></div><div class="story-grid">{''.join(card(s) for s in related)}</div></section>{newsletter()}'''
    (ROOT / url(story)).write_text(page(story['title'], story['excerpt'], content))
home = f'''<!-- editorial-home:start -->
<section class="section home-editorial" aria-labelledby="home-editorial-title"><div class="container"><div class="section-heading"><p class="eyebrow">FROM MY JOURNAL</p><h2 id="home-editorial-title">Latest From Fola</h2></div><p class="home-editorial-intro">A little curiosity, a fresh perspective, something worth exploring. Discover my upcoming editorial space through these sample stories.</p><div class="story-grid">{''.join(card(s) for s in stories[:3])}</div><div class="editorial-home-action"><a class="button button-secondary" href="blog.html">View All Stories <span aria-hidden="true">↗</span></a></div></div></section>
{newsletter()}
<!-- editorial-home:end -->'''
if '<!-- editorial-home:start -->' in index:
    index = re.sub(r'<!-- editorial-home:start -->.*?<!-- editorial-home:end -->', lambda _: home, index, flags=re.S)
else:
    index = index.replace('<section class="home-ending"', home+'\n<section class="home-ending"', 1)
(ROOT / 'index.html').write_text(index)
print(f'Built blog, {len(stories)} articles and homepage editorial section.')
