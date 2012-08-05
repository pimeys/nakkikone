class Nakki < ActiveRecord::Base
  attr_accessible :slot, :assign

  belongs_to :user
  belongs_to :nakkitype
  
  def as_json(options={})
    {
      :id => id,
      :slot => slot,
      :assign => user.nil? ? nil : user.name,
      :type => nakkitype.nil? ? nil : nakkitype.name
    }
  end
end
