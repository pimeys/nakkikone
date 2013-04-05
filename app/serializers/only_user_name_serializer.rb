class OnlyUserNameSerializer < ActiveModel::Serializer
  attribute :nick, :key => :name
end
