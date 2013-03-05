class AuxNakitController < ApplicationController
  #before_filter :admin_access

  def index
    current_party = Party.find(params[:party_id]) #TODO move finder to upper class
    aux_nakkis = current_party.aux_nakkis 
    render :json => aux_nakkis, :root => false
  end

  def create
    current_party = Party.find(params[:party_id])
    aux_nakki = current_party.aux_nakkis.create({:name => params[:name]})
    aux_nakki.user = current_user

    if aux_nakki.save
      render :json => aux_nakki 
    else
      render :status => 500, :text => "what what"
    end
  end

  def destroy
    current_party = Party.find(params[:party_id]) #TODO move finder to upper class
    current_party.aux_nakkis.destroy(params[:id])
  end
end
