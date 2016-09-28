<?php declare(strict_types = 1);

namespace App;

use Cntrl;

class HomepagePresenter extends BasePresenter
{

	public function renderDefault()
	{
		$vp = new Cntrl\VisualPaginator($this, 'paginator');
		$paginator = $vp->getPaginator();
		$paginator->itemsPerPage = 10;
		$paginator->itemCount = ITEMCOUNT; //see RouterFactory.php
		$posts = $this->posts->findBy(['publish_date <=' => new \DateTime()], ['date' => 'DESC'], $paginator->itemsPerPage, $paginator->offset);
		$this->template->posts = $posts;
	}

	public function renderRss()
	{
		$this->template->posts = $this->posts->findBy(['publish_date <=' => new \DateTime()], ['date' => 'DESC'], 50);
	}

	public function renderSitemap()
	{
		$this->template->sitemap = $this->posts->findBy(['publish_date <=' => new \DateTime()]);
	}

}
