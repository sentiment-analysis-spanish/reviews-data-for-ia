cd ..
cd data/json_bundle_reviews
#gunzip -ck large-bundle-corona.json > reviews-180k-bundle-after-corona.json.gz
#zip reviews-600k-bundle-20200413-full-bundle.zip large-bundle.json 

cd ..
zip positive_reviews_1m.zip positive_reviews.json 
zip negative_reviews_1m.zip negative_reviews.json 
