require 'pathname'
require 'rubygems'
require 'rack'

path = Pathname.new('.').realpath.to_s

run Rack::Directory.new path