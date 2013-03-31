class PartySerializer < ActiveModel::Serializer
  attributes :id, :title, :date, :description
  attribute :info_date, :key => :infoDate
end
