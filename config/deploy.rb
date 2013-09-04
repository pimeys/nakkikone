set :application, "nakkikone"

set :repository, "https://github.com/EntropyRy/nakkikone.git"
set :branch, "master"
set :git_enable_submodules, 1

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :deploy_to, "/var/railsapps/#{application}"
set :deploy_via, :remote_cache

set :user, "entropy"
set :domain, "entropy.fi"
server domain, :app, :web
role :db, domain, :primary => true

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end
