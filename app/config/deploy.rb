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
set :user, "codingninja"
set :use_sudo, false
set :cache_warmup,          false
set :maintenance_basename, "maintenance"
set :repository,  "https://github.com/CodingNinja/Informative-Workspaces"
set :scm,         :git
role :app,        "54.251.59.94"

set :model_manager, "doctrine"

set  :keep_releases,  3

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL
default_run_options[:pty] = true

after "deploy:create_symlink" do
    run "chmod -Rf 0777 #{deploy_to}/current/app/cache #{deploy_to}/current/app/logs"
end
