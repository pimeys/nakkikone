class ParcipitantsController < ApplicationController
  skip_before_filter :require_login
  
  def index
    @current_party = Party.find(params[:party_id])
    @nakkilist = []
    @current_party.nakkitypes.each{ |t|
      @nakkilist += t.nakkis
    }
    
    @parcipitants = @nakkilist.map{|nakki| 
      nakki.user
    }

    respond_to do |format|
      format.json { render :json => @parcipitants.select{|t| !t.nil?} }
    end
  end

  def create
    @user = User.create(:name => params[:name], :email => params[:email], :password => "foobar", :number => params[:number])
    render :json => @user
  end

  def get_current_party
    Party.find(params[:party_id]);
  end
end
