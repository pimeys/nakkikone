class Nakki < ActiveRecord::Base
  attr_accessible :slot, :assign

  belongs_to :user
  belongs_to :nakkitype
  
  def as_json(options={})
    {
      :id => id,
      :slot => slot,
      :assign => user.name,
      :type => nakkitype.name
    }
  end
end
