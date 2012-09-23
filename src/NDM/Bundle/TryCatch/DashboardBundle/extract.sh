rm -rf generated
mkdir -p generated
cp -Rf Resources/public/* generated/
curl http://trycatch.dev/app_dev.php/dash/?dash=central_tech > generated/index.html
tar -czvf dashboard.tar.gz generated

