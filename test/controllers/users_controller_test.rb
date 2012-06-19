require_relative "../minitest_helper"

describe UsersController do
  it "renders 'new'" do
    get :new
    response.status.must_equal 200
  end

  it "builds an user on 'new'" do
    user = FactoryGirl.build(:user)
    User.stubs(:new).returns(user)

    get :new

    assigns(:user).must_equal user
  end

  it "creates an user with valid params" do
    User.count.must_equal 0
    post :create, :user => FactoryGirl.attributes_for(:user)
    response.status.must_equal 302
    User.count.must_equal 1
  end

  it "won't create an user with invalid params" do
    User.count.must_equal 0
    post :create, :user => FactoryGirl.attributes_for(:user, :password => nil)
    response.status.must_equal 200
    User.count.must_equal 0
  end
end
