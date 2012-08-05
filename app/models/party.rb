class Party < ActiveRecord::Base
  attr_accessible :title, :description, :date

  has_many :nakkis, :dependent => :delete_all
  has_many :users
  has_many :nakkitypes, :dependent => :delete_all
  
  validates :title,  :presence => true
  validates :description,  :presence => true

  def as_json(options={})
    {
      :id => id,
      :title => title,
      :description => description,
      :date => date
    }
  end

end
