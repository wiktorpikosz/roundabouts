# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true
  config.vm.network "private_network", ip: "192.168.56.104", name: "VirtualBox Host-Only Ethernet Adapter"
  config.vm.synced_folder '.', '/vagrant', type: "smb"
  config.vm.provision "shell", path: "./vagrant/provision.sh"
end
