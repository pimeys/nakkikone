# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :nakkitype_info do
    sequence :id do |n|
      n
    end

    sequence :title do |n|
      "#{n}th title"
    end

    sequence :description do |n|
      "#{n}th description"
    end
  end
end
