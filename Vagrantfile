# Vagrantfile

begin
  require 'dotenv'
  Dotenv.load '.env'
rescue LoadError; end

#################
# CONFIG VALUES #
#################

PORT = ENV.fetch('PORT', 3000).to_i
BOX_NAME = "trusty64-ruby-1.0"
BOX_URI = "https://a8d79f51eeed1be02b25158fb6c0a5999c68a8f8.googledrive.com/host/0B1_wJcjGQU0oREE4TmxmVVI4WFU/trusty64-ruby-1.0.box"
VF_BOX_URI = "http://files.vagrantup.com/precise64_vmware_fusion.box"
DO_BOX_URI = "https://github.com/smdahlen/vagrant-digitalocean/raw/master/box/digital_ocean.box"
DO_CLIENT_ID = 'qcNXumImuDR9omT55OgsO'
DO_API_KEY = '3ad3a2f5f721967c178d5787528930fc'
SSH_PRIVKEY_PATH = ENV.fetch("SSH_PRIVKEY_PATH", "~/.ssh/id_rsa")
INSTANCE_NAME = File.basename(Dir.getwd)
FORWARDED_PORTS = {
                  }

#################
# BUILD SCRIPTS #
#################

### MINIMAL BUILD SCRIPT ###
## For customized base boxes with our environment preinstalled
$minimal_script = <<MINIMAL

# Username
user="$1"
if [ -z "$user" ]; then
    user=vagrant
fi

# Set environment variables
export DEBIAN_FRONTEND=noninteractive

# Update and upgrade
apt-get update -q
apt-get -qy -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade

# Install Ruby from .ruby-version
if [[ -f /vagrant/.ruby-version || -f /vagrant/.rbenv-version ]]; then
  ruby_version=`cat /vagrant/.ruby-version || cat /vagrant/.rbenv-version`
else
  ruby_version="2.1.3"
fi
su - $user -c "rbenv update"
su - $user -c "rbenv install $ruby_version 2>/dev/null"
su - $user -c "rbenv global $ruby_version 2>/dev/null"

# Create first run script
su - $user -c "echo '#!/bin/bash
cd /vagrant && bundle
if [ -f /vagrant/db/schema.rb ]; then
  cd /vagrant && bundle exec rake db:setup
else
  cd /vagrant && bundle exec rake db:create
fi
rm ~/.firstrun' >> ~/.firstrun"

echo ""
echo "Vagrant VM build complete. You can now connect to the new VM with 'vagrant ssh'"
MINIMAL

### FULL BUILD SCRIPT ###
## For virgin base boxes with only OS preinstalled
$script = <<SCRIPT

# The username to add to the docker group will be passed as the first argument
# to the script.  If nothing is passed, default to "vagrant".
user="$1"
if [ -z "$user" ]; then
    user=vagrant
fi

# Function for adding aliases
# eg. add_alias "rs" "rails server"
add_alias() {
  su - $user -c "echo alias \\'$1\\'=\\'$2\\' >> ~/.bash_aliases"
  su - $user -c "echo alias \\'$1\\'=\\'$2\\' >> ~/.zsh_aliases"
}

# Set environment variables
export DEBIAN_FRONTEND=noninteractive
export LANGUAGE="en_US.UTF-8"
export LANG="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

# Configure locales
echo 'LANG="en_US.UTF-8"' > /etc/default/locale
echo 'LC_ALL="en_US.UTF-8"' >> /etc/default/locale
locale-gen en_US.UTF-8
dpkg-reconfigure locales
update-locale LANG="en_US.UTF-8"

# Source ~/.zsh_aliases in ~/.zshrc (~/.bashrc already sources ~/.bash_alises)
su - $user -c "echo 'if [ -f ~/.zsh_aliases ]; then' >> ~/.zshrc"
su - $user -c "echo '  source ~/.zsh_aliases' >> ~/.zshrc"
su - $user -c "echo 'fi' >> ~/.zshrc"

# Source bashrc/zshrc in bash_profile/zprofile
su - $user -c "echo 'if [ -f ~/.bashrc ]; then' >> ~/.bash_profile"
su - $user -c "echo '  source ~/.bashrc' >> ~/.bash_profile"
su - $user -c "echo 'fi' >> ~/.bash_profile"
su - $user -c "echo 'if [ -f ~/.zshrc ]; then' >> ~/.zprofile"
su - $user -c "echo '  source ~/.zshrc' >> ~/.zprofile"
su - $user -c "echo 'fi' >> ~/.zprofile"

# Install software-properties for add-apt-repository command
apt-get update -q
apt-get install -qy software-properties-common python-software-properties

# PostgreSQL repo
wget -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
echo 'deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main' > /etc/apt/sources.list.d/pgdg.list

# Redis repo
add-apt-repository ppa:rwky/redis

# wkhtmltopdf dailies repo
# add-apt-repository ppa:wkhtmltopdf/daily

# NodeJS repo
add-apt-repository ppa:chris-lea/node.js

# Oracle Java 8 - not using yet, cannot be installed uninteractive?
# add-apt-repository ppa:webupd8team/java

# Update package metadata and installed packages
apt-get update -q
apt-get -qy -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade

# Package groups
basic_packages="autoconf automake build-essential bison cmake ctags curl git libc6-dev libgtkmm-3.0-1 libgtkmm-3.0-dev libmysql++-dev libqtwebkit-dev libnotify4 libnotify-dev "\
"libreadline6 libreadline6-dev libsqlite3-dev libssl-dev libxml2 libxml2-dev libxslt1.1 libxslt1-dev libyaml-dev make nodejs openssl sqlite3 tar wget wkhtmltopdf vim zlib1g zlib1g-dev"
postgres="postgresql-9.2 postgresql-contrib-9.2 postgresql-server-dev-9.2 libpq-dev"
redis="redis-server"
memcached="memcached"
imagemagick="imagemagick libmagickwand4 libmagickwand-dev libmagick++4 libmagick++-dev libmagickcore-dev libmagickcore4 libmagickcore4-extra ghostscript libgs9 libgs-dev"
openjdk_java="openjdk-7-jdk openjdk-7-jre-headless ant"
oracle_java="oracle-java8-installer ant"
shellapps="tmux htop"
apt-get install -qy $basic_packages $postgres $redis $memcached $imagemagick $openjdk_java $shellapps

# NPM packages
npm install -g phantomjs

# Configure PostgreSQL 9.2
pg_dropcluster --stop 9.2 main
pg_createcluster --start 9.2 --locale en_US.UTF-8 --encoding UTF8 main
echo "listen_addresses = '*'" >> /etc/postgresql/9.2/main/postgresql.conf
echo "host	all		all		10.0.0.0/16		trust" >> /etc/postgresql/9.2/main/pg_hba.conf
sed -i 's/md5/trust/g' /etc/postgresql/9.2/main/pg_hba.conf
su - postgres -c "createuser -s $user"
service postgresql restart

# Configure Redis
## No configuration necessary at this point in time, Redis installs ready to go
## for localhost use

# Install rbenv and plugins
su - $user -c 'git clone git://github.com/sstephenson/rbenv.git ~/.rbenv'
su - $user -c "echo 'export PATH=\"~/.rbenv/bin:$PATH\"' >> ~/.bash_profile"
su - $user -c 'echo eval \\"$\\(rbenv init -\\)\\" >> ~/.bash_profile'
su - $user -c 'git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build'
su - $user -c 'git clone git://github.com/tpope/rbenv-ctags.git ~/.rbenv/plugins/rbenv-ctags'
su - $user -c 'git clone https://github.com/sstephenson/rbenv-default-gems.git ~/.rbenv/plugins/rbenv-default-gems'
su - $user -c 'git clone https://github.com/rkh/rbenv-update.git ~/.rbenv/plugins/rbenv-update'
su - $user -c "git clone https://github.com/sstephenson/rbenv-gem-rehash ~/.rbenv/plugins/rbenv-gem-rehash"
su - $user -c "echo 'gem-ctags' > ~/.rbenv/default-gems"
su - $user -c "echo 'gem-browse' > ~/.rbenv/default-gems"
su - $user -c "echo 'bundler' > ~/.rbenv/default-gems"
su - $user -c "echo 'foreman' >> ~/.rbenv/default-gems"
su - $user -c "echo 'git-up' >> ~/.rbenv/default-gems"
su - $user -c "echo 'mailcatcher' >> ~/.rbenv/default-gems"
su - $user -c "echo 'paint' >> ~/.rbenv/default-gems"
su - $user -c "echo 'pry' >> ~/.rbenv/default-gems"
su - $user -c "echo 'pry-remote' >> ~/.rbenv/default-gems"
su - $user -c "echo 'pry-coolline' >> ~/.rbenv/default-gems"
su - $user -c "echo 'awesome_print' >> ~/.rbenv/default-gems"
if [[ -f /vagrant/.ruby-version || -f /vagrant/.rbenv-version ]]; then
  ruby_version=`cat /vagrant/.ruby-version || cat /vagrant/.rbenv-version`
else
  ruby_version="2.1.3"
fi
su - $user -c "rbenv install $ruby_version"
su - $user -c "rbenv global $ruby_version"

# Ruby/Rails aliases
add_alias "b" "bundle"
add_alias "be" "bundle exec"
add_alias "bu" "bundle update"
add_alias "r" "bundle exec rake"
add_alias "rs" "bundle exec rails server"
add_alias "fs" "bundle exec foreman start"
add_alias "rr" "bundle exec rake routes"
add_alias "rg" "bundle exec rails generate"
add_alias "rdbset" "bundle exec rake db:setup"
add_alias "rdbm" "bundle exec rake db:migrate && bundle exec rake db:test:prepare"
add_alias "rdbs" "bundle exec rake db:seed"
add_alias "rdbtp" "bundle exec rake db:test:prepare"

# Git aliases
add_alias "g" "git"
add_alias "gu" "git up"
add_alias "gc" "git checkout"
add_alias "gb" "git checkout -b"
add_alias "gd" "git diff"
add_alias "gst" 'git status'
add_alias "gcm" 'git checkout master'
add_alias "gcu" 'git checkout uat'
add_alias "glol" 'git log --graph --decorate --pretty=oneline --abbrev-commit'
add_alias "glola" 'git log --graph --decorate --pretty=oneline --abbrev-commit --all'
add_alias "gl" "git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)an>%Creset' --abbrev-commit"

# Create first run script
su - $user -c "echo '#!/bin/bash
cd /vagrant && bundle
if [ -f /vagrant/db/schema.rb ]; then
  cd /vagrant && bundle exec rake db:setup
  gem install mailcatcher
else
  cd /vagrant && bundle exec rake db:create
  gem install mailcatcher
fi
rm ~/.firstrun' >> ~/.firstrun"

# Configure first run script to run and delete after completion
su - $user -c "echo 'if [ -f ~/.firstrun ]; then
  /bin/bash ~/.firstrun
fi' >> ~/.bash_profile"
su - $user -c "echo 'if [ -f ~/.firstrun ];
  /bin/bash ~/.firstrun
fi' >> ~/.zprofile"

# cd to /vagrant on each login
su - $user -c "echo 'cd /vagrant' >> ~/.bash_profile"
su - $user -c "echo 'cd /vagrant' >> ~/.zprofile"
SCRIPT

################
# PROVISIONING #
################

Vagrant.configure("2") do |config|
  config.vm.box = BOX_NAME
  config.vm.box_url = BOX_URI
  config.vm.hostname = INSTANCE_NAME
  config.vm.network :private_network, ip: '192.168.255.2'
  config.vm.network :forwarded_port, host: PORT, guest: PORT
  config.vm.network :forwarded_port, host: 1080, guest: 1080, auto_correct: true # Mailcatcher
  config.vm.network :forwarded_port, host: 6379, guest: 6379, auto_correct: true
  config.vm.network :forwarded_port, host: 8888, guest: 8888, auto_correct: true
  config.vm.network :forwarded_port, host: 5432, guest: 5432, auto_correct: true
  config.ssh.username = 'vagrant'
  config.ssh.forward_agent = true
  config.vm.define INSTANCE_NAME do |instance|
    instance.vm.hostname = INSTANCE_NAME
  end

  # Use NFS if we're on OS X or Linux
  nfs_setting = RUBY_PLATFORM =~ /darwin/ || RUBY_PLATFORM =~ /linux/
  config.vm.synced_folder '.', '/vagrant', id: 'vagrant-root', :nfs => nfs_setting

  config.vm.provider :virtualbox do |vb, override|
    override.vm.provision :shell, :inline => $minimal_script
    vb.name = INSTANCE_NAME
    vb.customize ['modifyvm', :id, '--memory', '1024']
    vb.customize ['modifyvm', :id, '--ioapic', 'on']
    vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    vb.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
  end

  config.vm.provider :vmware_fusion do |f, override|
    override.vm.box_url = VF_BOX_URI
    override.vm.synced_folder '.', '/vagrant', disabled: true
    override.vm.provision :shell, :inline => $script
    f.vmx['displayName'] = BOX_NAME
  end

  config.vm.provider :digital_ocean do |provider, override|
    override.ssh.private_key_path = SSH_PRIVKEY_PATH
    override.vm.provision :shell, :inline => $script
    override.vm.box = 'digital_ocean'
    override.vm.box_url = DO_BOX_URI
    override.vm.hostname = "#{INSTANCE_NAME}-#{ENV['USER']}"
    provider.client_id = DO_CLIENT_ID
    provider.api_key = DO_API_KEY
    provider.ssh_key_name = ENV['USER']
  end
end

# Originally sourced from, but no longer resembling:
# https://github.com/dotcloud/docker/blob/master/Vagrantfile
# (copied 2013-11-18)

# vi: set ft=ruby
