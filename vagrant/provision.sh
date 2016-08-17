#!/bin/bash
sudo apt-get install -y ansible
chmod -x /vagrant/vagrant/ansible/inventory
ansible-playbook /vagrant/vagrant/ansible/vagrant.yml -i /vagrant/vagrant/ansible/inventory
