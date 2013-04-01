class AuxNakitController < ApplicationController
  before_filter :admin_access 
  skip_before_filter :admin_access, :only => [:create]

  def index
    current_party = get_current_party
    aux_nakkis = current_party.aux_nakkis
    render :json => aux_nakkis, :root => false
  end

  def create
    current_party = get_current_party
    aux_nakki = current_party.aux_nakkis.new({:nakkiname => params[:type]})
    aux_nakki.user = current_user

    if aux_nakki.save
      render :json => aux_nakki
    else
      render :status => 500, :text => aux_nakki.errors.full_messages
    end
  end

  def destroy
    current_party = get_current_party
    current_party.aux_nakkis.destroy(params[:id])
    render :json => {}
  end
end
