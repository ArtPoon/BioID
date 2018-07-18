# Installing a development version of BioID

BioID is a collection of Markdown documents to be rendered into static HTML pages with [Jekyll](https://jekyllrb.com/).  To 

1. Clone this repository to your local computer:
   ```bash
   git clone http://github.com/ArtPoon/BioID
   ```
2. Install Ruby gem `bundler` if not already on your system:
   ```bash
   sudo gem install bundler jekyll
   ```
3. Install gems required by the site
   ```
   sudo bundle install
   ```
4. Start the local server using the bash script in the root directory of `BioID`:
   ```
   bash run-server.sh
   ```
