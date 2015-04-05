require_relative '../minitest_helper'

describe NakkitypeInfo do
  before do
    @info = FactoryGirl.create(:nakkitype_info)

    @info_sametitle1 = FactoryGirl.create(:nakkitype_info, :title => "same title")
    @info_sametitle2 = FactoryGirl.build(:nakkitype_info, :title => "same title")
  end

  it "requires a title" do
    @info.title = nil
    @info.valid?.wont_equal true
    @info.errors.messages.keys.must_include :title
  end

  it "requires unique title" do
    @info_sametitle1.valid? true
    @info_sametitle2.valid?.wont_equal true
    @info_sametitle2.errors.messages.keys.must_include :title
  end
end
