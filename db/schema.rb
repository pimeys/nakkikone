# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110124034948) do

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "name"
    t.string   "number"
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "parties", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.datetime "date"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "nakkitypes", :force => true do |t|
    t.string   "name", :null => false
    t.datetime "starttime", :null => false
    t.datetime "endtime", :null => false
    t.integer  "party_id"
  end

  create_table "nakkis", :force => true do |t|
    t.string   "type"
    t.string   "assign"
    t.integer  "slot", :null => false
    t.integer  "user_id"
    t.integer  "party_id", :null => false
    t.integer  "nakkitype_id", :null => false
  end

end
