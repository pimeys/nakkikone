class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :number, :role, :nick
end
