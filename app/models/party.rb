class Party < ActiveRecord::Base
  attr_accessible :title, :description, :date, :info_date

  has_many :aux_nakkis, :dependent => :delete_all
  has_many :nakkitypes, :dependent => :delete_all
  
  validates :title, :presence => true, :uniqueness => true, :length => {
    :minimum => 3,
    :maximum => 50,
    :too_short => "#{count} character is minimum allowed",
    :too_long => "#{count} character is maximum allowed"
  }
  validates :description, :presence => true, :length => {
    :minimum => 3,
    :maximum => 1000,
    :too_short => "#{count} character is minimum allowed",
    :too_long => "#{count} character is maximum allowed"
  }
  validates :date, :presence => true
  validates :info_date, :presence => true

  class PartyTimeValidator < ActiveModel::Validator #TODO move to own file...
    def validate(record)
      if record.date.past?
        record.errors[:date] << "Party Date must be in future"
      end
      if record.info_date > record.date
        record.errors[:info_date] << "Party Info date must be before actual party start"
      end
    end
  end

  validates_with Party::PartyTimeValidator
end
