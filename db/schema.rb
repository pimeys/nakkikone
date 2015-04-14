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

ActiveRecord::Schema.define(:version => 20150414173308) do

  create_table "aux_nakkis", :force => true do |t|
    t.string  "nakkiname", :null => false
    t.integer "user_id"
    t.integer "party_id",  :null => false
  end

  create_table "nakkis", :force => true do |t|
    t.integer "slot",         :null => false
    t.integer "user_id"
    t.integer "nakkitype_id", :null => false
  end

  create_table "nakkitype_infos", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "nakkitype_infos", ["id"], :name => "index_nakkitype_infos_on_id"

  create_table "nakkitypes", :force => true do |t|
    t.integer "party_id",          :null => false
    t.integer "nakkitype_info_id", :null => false
  end

  add_index "nakkitypes", ["nakkitype_info_id"], :name => "index_nakkitypes_on_nakkitype_info_id"

  create_table "parties", :force => true do |t|
    t.string   "title",       :null => false
    t.text     "description"
    t.datetime "date",        :null => false
    t.datetime "info_date",   :null => false
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email",         :null => false
    t.string   "name",          :null => false
    t.string   "nick"
    t.string   "number"
    t.string   "role",          :null => false
    t.string   "password_hash", :null => false
    t.string   "password_salt", :null => false
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

end
