class AuxUserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :number

  attribute :nakkiname, :key => :type
  
  # todo kill this unholy bastard
  def id
    object.id
  end

  def email
    object.user.email
  end

  def name
    object.user.name
  end

  def number
    object.user.number
  end
end
