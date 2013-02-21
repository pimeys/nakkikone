# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Emanuel', :city => cities.first)

adminUser = User.create({ :name => 'jokuTm', 
                          :email => 'webmaster@entropy.fi',
                          :number => '+35840123456',
                          :password => 'nakki-test' 
                        })

party0 = Party.create({ :title => 'Example Party!',
                        :description => 'very short description indeed',
                        :date => Date.today
                      })
