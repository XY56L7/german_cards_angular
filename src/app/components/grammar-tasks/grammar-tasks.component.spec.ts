import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarTasksComponent } from './grammar-tasks.component';

describe('GrammarTasksComponent', () => {
  let component: GrammarTasksComponent;
  let fixture: ComponentFixture<GrammarTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
