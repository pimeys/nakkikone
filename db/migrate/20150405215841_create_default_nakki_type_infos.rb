class CreateDefaultNakkiTypeInfos < ActiveRecord::Migration
  def up
    NakkitypeInfo.create({:title => "Ticket Sales", :description => "You will sell tickets and count every sold ticket."})
    NakkitypeInfo.create({:title => "Kiosk", :description => "You will sell/give refreshments. This is the most hectic Nakki."})
    NakkitypeInfo.create({:title => "Cloackroom", :description => "You will take peoples jackets and stuff and mark them properly so that you can find them later and you will make sure nobody steals anything from hte cloakroom."})
    NakkitypeInfo.create({:title => "Bouncer", :description => "There's usually just few Bouncers in a party who get paid for their work. They make sure everybody has great time and they know what to do in emergency situations."})
    NakkitypeInfo.create({:title => "Light Controller", :description => "You control the lights. You should come to build up the party because you get to know where all the lamps are and to test and program how they work."})
  end

  def down
    NakkitypeInfo.where(:title => ["Ticket Sales", "Kiosk", "Cloackroom", "Bouncer","Light Controller"]).each {|e| e.destroy}
  end
end
