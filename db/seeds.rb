# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Emanuel', :city => cities.first)

# Creating admin user:  

# Change email/password accordingly before deploying to production to
# ensure safety, rembemer that this files history is hosted at github.
adminUser = User.create({ :name => 'webmaster', 
                          :email => 'webmaster@entropy.fi',
                          :number => '+35840123456',
                          :password => 'nakki-test' 
                        })

# Development seeds:
# You should comment these out during production deployments

# 1. Party
example_party = Party.create({ :title => 'Example Party!',
                               :description => 'Party specific descriptions, notes to participants. This will be shown in public side as well',
                               :date => Date.today,
                               :info_date => Date.today
                             })

# 2. Nakkittypes and nakkis:
# Generic nakki pattern, so that we see table forms properly 

[
 {:name => "backup",    :start => 3, :end => 4},
 {:name => "selling-1", :start => 0, :end => 6},
 {:name => "selling-2", :start => 0, :end => 6},
 {:name => "door-1",    :start => 0, :end => 4},
 {:name => "door-2",    :start => 2, :end => 5},
 {:name => "VJ",        :start => 0, :end => 6}
].each{ |type|
  nakkitype = example_party.nakkitypes.create(:name => type[:name])
  (type[:start]..type[:end]).each{ |i| nakkitype.nakkis.create(:slot  => i) } 
}

# 3. Random test users
basicUser = User.create({ :name => 'jokuTm', 
                          :email => 'somebody@mail.com',
                          :number => '+35840123456',
                          :password => 'nakki-user' 
                        })

basicUser2 = User.create({ :name => 'jokuToinenTm', 
                          :email => 'somebodyelse@mail.com',
                          :number => '+35840123456',
                          :password => 'nakki-user' 
                        })

# 4. Assinign Random user to party
example_party.nakkitypes[0].nakkis.each{ |nakki| 
  #nakki = Nakki.find(i)
  nakki.user = basicUser
  nakki.save
}

example_party.nakkitypes[3].nakkis.each{ |nakki| 
  #nakki = Nakki.find(i)
  nakki.user = basicUser2
  nakki.save
}

# 5. Assigning user to both constructing and cleaning
#aux_nakki_cleaning = example_party.aux_nakkis.new({:nakkiname => "clean", :user => basicUser})
aux_nakki = example_party.aux_nakkis.new({:nakkiname => "const"})
aux_nakki.user = basicUser
aux_nakki.save

aux_nakki = example_party.aux_nakkis.new({:nakkiname => "clean"})
aux_nakki.user = basicUser2
aux_nakki.save

aux_nakki = example_party.aux_nakkis.new({:nakkiname => "const"})
aux_nakki.user = basicUser2
aux_nakki.save

# 6. Vanilla party without parcipitants
example_party = Party.create({ :title => 'Party Template?',
                               :description => 'Party specific descriptions, notes to participants. This will be shown in public side as well',
                               :date => Date.today,
                               :info_date => Date.today
                             })
[
 {:name => "selling-1", :start => 0, :end => 6},
 {:name => "selling-2", :start => 0, :end => 6},
 {:name => "door-1",    :start => 0, :end => 4},
 {:name => "door-2",    :start => 2, :end => 5},
 {:name => "VJ",        :start => 0, :end => 6}
].each{ |type|
  nakkitype = example_party.nakkitypes.create(:name => type[:name])
  (type[:start]..type[:end]).each{ |i| nakkitype.nakkis.create(:slot  => i) } 
}
