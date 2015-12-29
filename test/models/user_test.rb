require_relative '../minitest_helper'

# describe User do
#   before do
#     @user = FactoryGirl.create(:user, 
#                                :password => 'password', 
#                                :password_confirmation => 'password')
#   end

#   it "requires an email" do
#     @user.email = nil
#     @user.valid?.wont_equal true
#     @user.errors.messages.keys.must_include :email
#   end

#   it "requires a password" do
#     @user.password = nil
#     @user.valid?.wont_equal true
#     @user.errors.messages.keys.must_include :password
#   end

#   it "authenticates with correct password" do
#     User.authenticate(@user.email, 'password').must_equal @user
#   end

#   it "won't authenticate with wrong password" do
#     User.authenticate(@user.email, 'wrong_pass').must_be_nil
#   end
# end
