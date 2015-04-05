require_relative '../minitest_helper'

describe NakkitypeInfosController do
  def json_response
    ActiveSupport::JSON.decode @response.body
  end

  setup do
    FactoryGirl.create_list(:nakkitype_info, 2)
    @request.headers['Accept'] = Mime::JSON
    @request.headers['Content-Type'] = Mime::JSON.to_s
  end

  it "index lists all infos" do
    get :index
    assert_response :success

    result_object = json_response

    assert_equal "1th title", result_object[0]["title"]
    assert_equal "2th title", result_object[1]["title"]

    assert_equal "1th description", result_object[0]["description"]
    assert_equal "2th description", result_object[1]["description"]
  end

  it "destroy deletes info" do
    remove_id = NakkitypeInfo.all.last[:id]

    delete :destroy, :id => remove_id, :format => :json
    assert_response :success

    NakkitypeInfo.count.must_equal 1
  end

  it "updates properly one info" do
    update_id = NakkitypeInfo.all.last[:id]

    put :update, { :id => update_id, :title => "another title"}, :format => :json
    assert_response :success

    assert_equal "another title", NakkitypeInfo.all.last[:title]
    assert_equal "another title", json_response["title"]
  end

  it "fails to update with invalid values" do
    update_id = NakkitypeInfo.all.last[:id]

    put :update, { :id => update_id, :title => "1"}, :format => :json
    assert_response :bad_request

    json_response.keys.must_include "title"
  end

  it "creates properly one info" do
    post :create, { :title => "new title", :description => "new description" }, :format => :json
    assert_response :success

    NakkitypeInfo.count.must_equal 3
    assert_equal "new title", NakkitypeInfo.all.last[:title]
    assert_equal "new title", json_response["title"]
  end

  it "fails to create with invalid values" do
    post :create, { :title => "1" }, :format => :json
    assert_response :bad_request

    NakkitypeInfo.count.must_equal 2
    json_response.keys.must_include "title"
  end
end

