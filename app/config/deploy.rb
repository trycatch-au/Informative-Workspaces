set :application, "TryCatch"
set :domain,      "trycatch.com.au"
set :deploy_to,   "/var/www/informative"
set :shared_files,      ["app/config/parameters.yml", "composer.phar", "vendor"]
set :shared_children,     ["vendor"]
set :asset_children,    []
set :dump_assetic_assets, false
set :dump_assets, false
set :deploy_via,  :remote_cache
set :app_path,    "app"
set :use_composer, true
set :user, "root"
set :use_sudo, false
set :cache_warmup,          false
set :maintenance_basename, "maintenance"
set :repository,  "http://svn01.ni.news.com.au/svn/Technology/trunk/InformativeWorkspaces/api/"
set :scm,         :subversion
role :web,        "informative.news.newslimited.local"

set :model_manager, "doctrine"

set  :keep_releases,  3

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL
default_run_options[:pty] = true

after "deploy:create_symlink" do
#  run "chmod -Rf 0777 #{deploy_to}/current/app/cache"
end

after "deploy:create_symlink" do
#  run "chmod -Rf 0777 #{deploy_to}/current/app/cache"
end
