source "https://rubygems.org"

# Gems
gem 'jekyll-seo-tag'

# Gems for full local dev
#gem "jekyll", "~> 4.2.0"
#gem "custom_jekyll_theme", path: "/Users/hubertchoo/Documents/PersonalCodingProjects/custom_jekyll_theme/"

# Gems for Github pages
gem "github-pages", "~> 215", group: :jekyll_plugins
gem "jekyll-remote-theme"

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

